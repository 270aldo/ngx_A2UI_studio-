export interface WidgetProps {
  [key: string]: any;
}

export interface WidgetPayload {
  type: string;
  props: WidgetProps;
  thought?: string;
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  text: string;
  thought?: string;
}

export interface TemplateItem {
  name: string;
  type: string;
  props: WidgetProps;
}

export interface TemplateCategory {
  [category: string]: TemplateItem[];
}