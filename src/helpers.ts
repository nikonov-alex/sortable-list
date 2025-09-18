import { State, Item } from "./index";
import { Constructs } from "@nikonov-alex/functional-library";
const local = Constructs.local;

export type ItemEvent = Event & { target: HTMLElement };

export const isItemEvent = ( event: Event ): event is ItemEvent =>
    ( event.target as HTMLElement ).matches( ".item, .item *" );

export type ItemElement = HTMLElement & { dataset: { index: string } };

const findItemElem = ( prevItem: HTMLElement, container: HTMLElement ): HTMLElement =>
    local( prevItem.parentElement!.closest( ".item" ) as HTMLElement, item =>
        null === item || !container.contains( item )
            ? prevItem
        : findItemElem(
            item,
            container
        ) );

export const getItemElement = ( event: ItemEvent ): ItemElement =>
    findItemElem(
        event.target.closest( ".item" ) as HTMLElement,
        (event.currentTarget as HTMLElement)
    ) as ItemElement;

export const getItemIndex = ( elem: ItemElement ): number =>
    parseInt( elem.dataset.index );

export type ActionEvent = Event & { target: HTMLElement };

export const isActionClick = ( event: Event ): event is ActionEvent =>
    ( event.target as HTMLElement ).matches( ".item-action, .item-action *" );

export type ActionElement = HTMLElement & { dataset: { index: string } };

export const getActionElement = ( event: ActionEvent ): ActionElement =>
    event.target.closest( ".item-action" ) as ActionElement;

export const getActionIndex = ( action: ActionElement ): number =>
    parseInt( action.dataset.index );

export const getItem = <I extends Item>( state: State<I>, index: number ): I =>
    state[index];

export const updateItem = <I extends Item>( state: State<I>, index: number, item: I ): State<I> =>
    state.with( index, item );

export const addItem = <I extends Item>( state: State<I>, item: I ): State<I> =>
    state.concat( item );

export const getEventItem = <I extends Item>( state: State<I>, event: ItemEvent ): I =>
    getItem( state, getItemIndex( getItemElement( event ) ) );