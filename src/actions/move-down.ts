import { Action, Item, State } from "@widgets/list";
import { Constructs, Types } from "@nikonov-alex/functional-library";
const local = Constructs.local;
import { JSX } from "jsx-dom";


const moveDown = <I extends Item>( state: State<I>, index: number ): Types.Maybe<State<I>> =>
    index >= state.length - 1
        ? false
        : state.map( ( item, currentIndex ) =>
            currentIndex === index
                ? state[index + 1]
                : currentIndex === index + 1
                    ? state[index]
                    : item
        );

const wrapper = <I extends Item>( state: State<I>, item: I, index: number ) =>
    local( moveDown( state, index ), newState =>
        !newState
            ? (alert( "Error!" ), state)
        : newState );

const make = <I extends Item>( button: JSX.Element ): Action<I> =>
    ( {
        button,
        action: wrapper
    } );

export { make };