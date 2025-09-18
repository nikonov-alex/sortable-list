import { Action, Item, State } from "@widgets/list";
import { JSX } from "jsx-dom";

const remove = <I extends Item>( state: State<I>, index: number ): State<I> =>
    state.toSpliced( index, 1 );

const wrapper = <I extends Item>( state: State<I>, item: I, index: number ) =>
    !confirm( "Are you sure?" )
        ? state
    : remove( state, index )

const make = <I extends Item>( button: JSX.Element ): Action<I> =>
    ( {
        button,
        action: wrapper
    } );

export { make };