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




export type State<I> = I[];

export const addItem = <I,>( state: State<I>, item: I ): State<I> =>
    state.concat( item );

export const getItem = <I,>( state: State<I>, index: ItemIndex ): I =>
    state[index] as I;

export const updateItem = <I,>( state: State<I>, index: ItemIndex, item: I ): State<I> =>
    state.with( index, item );

export const removeItem = <I,>( state: State<I>, index: ItemIndex ): State<I> =>
    state.toSpliced( index, 1 );

const moveUpItem = <I,>( state: State<I>, index: ItemIndex ): Types.Maybe<State<I>> =>
    0 === index
        ? false
        : state.map( ( item, currentIndex ) =>
            currentIndex === index - 1
                ? state[index]
                : currentIndex === index
                    ? state[index - 1]
                    : item
        );

const moveDownItem = <I,>( state: State<I>, index: ItemIndex ): Types.Maybe<State<I>> =>
    index >= state.length - 1
        ? false
        : state.map( ( item, currentIndex ) =>
            currentIndex === index
                ? state[index + 1]
                : currentIndex === index + 1
                    ? state[index]
                    : item
        );




const formatItem = ( elem: HTMLLIElement, classes?: string ): HTMLLIElement =>
    <li className={ "item " + elem.className + " " + ( classes ?? "" ) }
        style={ ITEM_STYLES }>
        { elem.childNodes }
    </li> as HTMLLIElement;

export const render = <I, S extends State<I>>( state: S, options: {
    displayItem: { ( item: I, buttons: HTMLElement ): HTMLLIElement },
    classes?: {
        list?: string
        item?: string
    },
    displayButtons?: HTMLElement
} ): HTMLElement =>
    <div className="list">
        { state.length > 0
            ? <ul className={ "items " + ( options.classes?.list ? options.classes?.list : "" ) }
                  style={ ITEMS_STYLES }>
                { state.map( item => formatItem(
                    options.displayItem(
                        item,
                        ( options.displayButtons
                                ? options.displayButtons
                                : ITEM_BUTTONS
                        ).cloneNode( true ) as HTMLElement
                    ),
                    options.classes?.item
                )) }
            </ul>
            : null
        }
    </div> as HTMLElement;





export type InsideItem = HTMLElement & { InsideItem: null };
export type ItemEvent = Event & { target: InsideItem };
type InsideItemButton = InsideItem & { InsideItemButton: null };
type ItemActionEvent = Event & { target: InsideItemButton };

type ItemButton = InsideItem & { ItemAction: null };

export const isItemAction = ( event: Event ): event is ItemActionEvent =>
    (event.target as HTMLElement).matches( ".item-action, .item-action *" );

export const isItemEvent = ( event: Event ): event is ItemEvent =>
    (event.target as HTMLElement).matches( ".item, .item *" );

export const getItemButton = ( elem: InsideItemButton ): ItemButton =>
    elem.closest( ".item-action" ) as ItemButton;

const getAction = ( action: ItemButton ): "remove" | "move-up" | "move-down" =>
    action.classList.contains( "remove-button" )
        ? "remove"
        : action.classList.contains( "move-up" )
            ? "move-up"
            : "move-down";

type ItemElem = HTMLElement & { Item: null };

export const getItemElem = ( elem: InsideItem ): ItemElem =>
    elem.closest( ".item" ) as ItemElem;

export type ItemIndex = number & { ItemIndex: null };

export const getIndex = ( item: ItemElem ): ItemIndex =>
    Array.prototype.indexOf.call(getItemsList( item ), item) as ItemIndex;

const getItemsList = ( elem: InsideItem | ItemElem ): NodeListOf<ItemElem> =>
    elem.closest( ".items" )!.childNodes as NodeListOf<ItemElem>;




export const itemAction = <I,>( state: State<I>, event: ItemActionEvent ): State<I> =>
    local( getItemButton( event.target ), button =>
        local( getAction( button ), action =>
            "remove" === action
                ? confirm( "Are you sure?" )
                    ? removeItem(
                        state,
                        getIndex( getItemElem( button ) )
                    )
                    : state :
                "move-up" === action
                    ? moveUpItem( state, getIndex( getItemElem( button ) ) ) || alert( "Error!" ) || state
                    : // "move-down" === action
                    moveDownItem( state, getIndex( getItemElem( button ) ) ) || alert( "Error!" ) || state
        ));

export const maybeItemAction = <I,>( state: State<I>, event: Event ): State<I> =>
    isItemAction( event )
        ? itemAction( state, event )
        : state




export const make = <I,>( items: I[] = [] ): State<I> =>
    items;