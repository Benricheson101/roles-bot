import 'discord-api-types';

declare module 'discord-api-types' {
  export interface MessageComponent {
    type: number;
  }

  export interface ActionRow extends MessageComponent {
    type: 1;
    components: Button[] | [Dropdown];
  }

  export interface Button extends MessageComponent {
    type: 2;
    style: ButtonStyle;
    disabled?: boolean;
    label: string;
    custom_id: string;
  }

  export const enum ButtonStyle {
    PRIMARY = 1,
    SECONDARY,
    SUCCESS,
    DANGER,
    LINK,
  }

  export interface Dropdown extends MessageComponent {
    type: 3;
    custom_id: string;
    placeholder?: string;
    max_values?: number;
    min_values?: number;
    options: DropdownItem[];
  }

  export interface DropdownItem {
    label: string;
    value: string;
    description?: string;
    emoji?: PartialEmoji;
    default?: boolean;
  }

  export interface PartialEmoji {
    name?: string;
    id?: string;
  }
}
