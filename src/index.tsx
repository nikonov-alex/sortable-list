import { JSX, StyleInput } from "jsx-dom";
import * as Reactor from "@nikonov-alex/reactor";
const merge = require('lodash.merge');
import { Constructs } from "@nikonov-alex/functional-library";
const local = Constructs.local;
import { ActionEvent, getItemIndex, isItemEvent, getActionIndex, getActionElement, getItemElement, isActionClick } from "./helpers";
import * as helpers from "./helpers";


const LIST_STYLES: StyleInput = {
    listStyleType: "none",
    padding: 0
};



type Item = {
    title: JSX.Element | string
}

type State<I extends Item> = I[];





const Action = <I extends Item>( action: Action<I>, index: number ): JSX.Element =>
    <span className="item-action" data-index={ index }>
        { action.button.cloneNode( true ) as JSX.Element }
    </span>;

const Actions = <I extends Item>( actions: Action<I>[] ) =>
    <div className="item-actions">
        { actions.map( Action ) }
    </div>;




type ActionFunc<I extends Item> = { ( state: State<I>, item: I, index: number, event: Event ): State<I> | [State<I>, Event] };

type Action<I extends Item> = {
    button: JSX.Element,
    action: ActionFunc<I>
}

type DisplayFunc<I extends Item> = { ( state: State<I> ): JSX.Element };
type DisplayItemFunc<I extends Item> = { ( item: I, index: number ): JSX.Element };
type DisplayContentFunc<I extends Item> = { ( item: I ): JSX.Element };
type DisplayActionsFunc<I extends Item> = { ( actions: Action<I>[] ): JSX.Element };
type DisplayActionFunc<I extends Item> = { ( action: Action<I>, index: number ): JSX.Element };

type Options<I extends Item> = {
    display?: { ( displayItem: DisplayItemFunc<I> ): DisplayFunc<I> },
    displayItem?: { ( displayContent: DisplayContentFunc<I> ): DisplayItemFunc<I> }
    displayContent?: { ( parent: DisplayContentFunc<I> ): DisplayContentFunc<I> },
    displayActions?: { ( displayAction: DisplayActionFunc<I> ): DisplayActionsFunc<I> },
    onItemClick?: { ( state: State<I>, event: Event ): State<I> | [State<I>, Event] },
    reactorArgs?: Partial<Reactor.Args<State<I>>>
    actions?: Action<I>[]
};

function make<I extends Item>(
    items: I[],
    options?: Options<I>
): Reactor.Type<State<I>> {

    const displayActions = options?.displayActions
        ? options.displayActions( Action )
        : Actions;

    const Content = ( item: I ): JSX.Element =>
        <div className="item-content">
            { item.title }
            { options?.actions
                ? displayActions( options.actions )
                : <span /> }
        </div>;

    const displayContent = options?.displayContent
        ? options.displayContent( Content )
        : Content;

    const displayItem = options?.displayItem
        ? options.displayItem( displayContent )
        : ( item: I, index: number ) =>
            <li className="item" data-index={ index }>
                { displayContent( item ) }
            </li>;

    const display = options?.display
        ? options.display( displayItem )
        : ( state: State<I> ): JSX.Element =>
            <ul className="items" style={ LIST_STYLES }>
                { state.map( displayItem ) }
            </ul>;

    const onActionClick = ( state: State<I>, event: ActionEvent ): State<I> | [State<I>, Event] =>
        local( {
            actions: options!.actions as Action<I>[],
            itemIndex: getItemIndex( getItemElement( event )),
            actionIndex: getActionIndex( getActionElement( event ) )
        }, ( { actions, itemIndex, actionIndex } ) =>
            actions[actionIndex].action( state, state[itemIndex], itemIndex, event ));

    const onClick = ( state: State<I>, event: Event ): State<I> | [State<I>, Event] =>
        isItemEvent( event )
            ? isActionClick( event )
                ? onActionClick( state, event )
            // @ts-ignore
            : options.onItemClick( state, event )
        : state;


    return Reactor.make( merge( { }, {
        initialState: items,
        display,
        events: options?.actions && options.actions.length || options?.onItemClick
            ? { click: {
                handler: onClick,
                options: { capture: false }
            } }
            : undefined,
    }, options?.reactorArgs ?? { } ) );
}

import * as _Actions from "./actions";
export { make, State, Item, Options, Action, DisplayFunc, DisplayItemFunc, DisplayContentFunc, DisplayActionFunc,
    LIST_STYLES, helpers, _Actions as Actions, ActionFunc };