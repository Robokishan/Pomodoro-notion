/* eslint-disable @typescript-eslint/no-empty-interface */
export interface DatabaseQuery {
  object?: string;
  results: Result[];
  next_cursor?: string;
  has_more?: boolean;
  type?: string;
  page?: Page;
}

export interface Page {}

export interface Result {
  object?: string;
  id: string;
  created_time?: string;
  last_edited_time?: string;
  created_by?: TedBy;
  last_edited_by?: TedBy;
  cover?: null;
  icon?: Icon | null;
  parent?: Parent;
  archived?: boolean;
  properties?: Properties;
  url?: string;
}

export interface TedBy {
  object?: string;
  id?: string;
}

export interface Icon {
  type?: string;
  emoji?: string;
  external?: External;
}

export interface External {
  url?: string;
}

export interface Parent {
  type?: string;
  database_id?: string;
}

export interface Properties {
  Priority?: Priority;
  Timeline?: Timeline;
  Status?: Priority;
  "Created At"?: CreatedAt;
  Tags?: Days;
  Days?: Days;
  Name?: Name;
}

export interface CreatedAt {
  id?: string;
  type?: string;
  created_time?: string;
}

export interface Days {
  id?: string;
  type?: string;
  multi_select?: Select[];
}

export interface Select {
  id?: string;
  name?: string;
  color?: string;
}

export interface Name {
  id?: string;
  type?: string;
  title?: Title[];
}

export interface Title {
  type?: string;
  text?: Text;
  annotations?: Annotations;
  plain_text?: string;
  href?: null | string;
}

export interface Annotations {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
}

export interface Text {
  content?: string;
  link?: External | null;
}

export interface Priority {
  id?: string;
  type?: string;
  select?: Select | null;
}

export interface Timeline {
  id?: string;
  type?: string;
  date?: DateClass | null;
}

export interface DateClass {
  start?: string;
  end?: string;
  time_zone?: null;
}
