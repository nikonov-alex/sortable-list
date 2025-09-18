import { Action, Item, State } from "../.";
import { Constructs, Types } from "@nikonov-alex/functional-library";
import { JSX } from "jsx-dom";
const local = Constructs.local;


const moveUp = <I extends Item>( state: State<I>, index: number ): Types.Maybe<State<I>> =>
    0 === index
        ? false
        : state.map( ( item, currentIndex ) =>
            currentIndex === index - 1
                ? state[index]
                : currentIndex === index
                    ? state[index - 1]
                    : item
        );

const wrapper = <I extends Item>( state: State<I>, item: I, index: number ) =>
    local( moveUp( state, index ), newState =>
        !newState
            ? (alert( "Error!" ), state)
        : newState );

const make = <I extends Item>( button: JSX.Element ): Action<I> =>
    ( {
        button,
        action: wrapper
    } );

export { make };