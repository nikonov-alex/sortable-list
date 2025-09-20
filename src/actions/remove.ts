import { Action, ActionFunc, Item, State } from "../.";
import { JSX } from "jsx-dom";

const action = <I extends Item>( state: State<I>, item: I, index: number ): State<I> =>
    state.toSpliced( index, 1 );

const ask = <I extends Item>( func: ActionFunc<I> ) =>
    ( state: State<I>, item: I, index: number, event: Event ) =>
        !confirm( "Are you sure?" )
            ? state
        : func( state, item, index, event )

const make = <I extends Item>( button: JSX.Element ): Action<I> =>
    ( { button, action: ask( action ) } );

export { make, action, ask };