import { Constructs, Types } from "@nikonov-alex/functional-library";
const local = Constructs.local;


const ITEMS_STYLES = {
    listStyleType: "none",
    padding: 0
};

const ITEM_STYLES = {
    display: "block"
};

const ITEM_ACTIONS_STYLES = {
    display: "block",
    float: "right"
}

const ITEM_BUTTONS = <span className="item-actions"
                                         // @ts-ignore
                                         style={ ITEM_ACTIONS_STYLES }>
    <span className="item-action move-up" />
    <span className="item-action move-down" />
    <span className="item-action remove-button" />
</span>;




type State<I> = I[];

const addItem = <I,>( state: State<I>, item: I ): State<I> =>
    state.concat( item );

const removeItem = <I,>( state: State<I>, index: number ): Types.Maybe<State<I>> =>
    !state[index]
        ? false
        : state.toSpliced( index, 1 );

const moveUpItem = <I,>( state: State<I>, index: number ): Types.Maybe<State<I>> =>
    0 === index || !state[index]
        ? false
    : state.map( ( item, currentIndex ) =>
        currentIndex === index - 1
            ? state[index]
        : currentIndex === index
            ? state[index - 1]
        : item
    );

const moveDownItem = <I,>( state: State<I>, index: number ): Types.Maybe<State<I>> =>
    index >= state.length - 1 || !state[index]
        ? false
    : state.map( ( item, currentIndex ) =>
        currentIndex === index
            ? state[index + 1]
        : currentIndex === index + 1
            ? state[index]
        : item
    );



const makeRender = <I, S extends State<I>>( options: {
    displayItem: { ( item: I, buttons: HTMLElement ): HTMLElement },
    classes?: {
        list?: string
        item?: string
    }
} ): { (s: S): HTMLElement } =>
    ( state: S ): HTMLElement =>
        <div className="list">
            { state.length > 0
                ? <ul className={ "items " + ( options.classes?.list ? options.classes?.list : "" ) }
                      style={ ITEMS_STYLES }>
                    { state.map( item => <li className={ "item " + ( options.classes?.list ? options.classes?.item : "" ) }
                                                style={ ITEM_STYLES }>
                        { options.displayItem( item, ITEM_BUTTONS.cloneNode( true ) as HTMLElement ) }
                    </li> ) }
                </ul>
                : null
            }
        </div> as HTMLElement;





type InsideItem = HTMLElement & { InsideItem: null };
type InsideItemButton = InsideItem & { InsideItemButton: null };
type ItemActionEvent = Event & { target: InsideItemButton };

type ItemButton = InsideItem & { ItemAction: null };

const isItemAction = ( event: Event ): event is ItemActionEvent =>
    (event.target as HTMLElement).matches( ".item-action, .item-action *" );

const getItemButton = ( elem: InsideItemButton ): ItemButton =>
    elem.closest( ".item-action" ) as ItemButton;

const getAction = ( action: ItemButton ): "remove" | "move-up" | "move-down" =>
    action.classList.contains( "remove-button" )
        ? "remove"
    : action.classList.contains( "move-up" )
        ? "move-up"
    : "move-down";

type ItemElem = HTMLElement & { Item: null };

const getItem = ( elem: InsideItem ): ItemElem =>
    elem.closest( ".item" ) as ItemElem;

const getIndex = ( item: ItemElem ): number =>
    Array.prototype.indexOf.call(getItemsList( item ), item);

const getItemsList = ( elem: InsideItem | ItemElem ): NodeListOf<ItemElem> =>
    elem.closest( ".items" )!.childNodes as NodeListOf<ItemElem>;




const itemAction = <I,>( state: State<I>, event: ItemActionEvent ): State<I> =>
    local( getItemButton( event.target ), button =>
    local( getAction( button ), action =>
        "remove" === action
            ? confirm( "Are you sure?" )
                ? removeItem(
                    state,
                    getIndex( getItem( button ) )
                ) || alert( "Item does not exist" ) || state
                : state :
            "move-up" === action
                ? moveUpItem( state, getIndex( getItem( button ) ) ) || alert( "Error!" ) || state
                : // "move-down" === action
                moveDownItem( state, getIndex( getItem( button ) ) ) || alert( "Error!" ) || state
    ));

const maybeItemAction = <I,>( state: State<I>, event: Event ): State<I> =>
    isItemAction( event )
        ? itemAction( state, event )
        : state




const make = <I,>( items: I[] = [] ): State<I> =>
    items;


export {
    State,
    make,
    makeRender,
    addItem,
    maybeItemAction,
    isItemAction,
    itemAction,
    getItem,
    getIndex,
    InsideItem
};