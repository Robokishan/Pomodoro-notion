export interface DatabaseList {
  object?: string;
  results?: Result[];
  next_cursor?: null;
  has_more?: boolean;
}

export interface Result {
  object?: string;
  id?: string;
  cover?: null;
  icon?: Icon;
  created_time?: string;
  created_by?: TedBy;
  last_edited_by?: TedBy;
  last_edited_time?: string;
  title?: Title[];
  description?: any[];
  is_inline?: boolean;
  properties?: Properties;
  parent?: Parent;
  url?: string;
  archived?: boolean;
}

export interface TedBy {
  object?: string;
  id?: string;
}

export interface Icon {
  type?: string;
  emoji?: string;
}

export interface Parent {
  type?: string;
  page_id?: string;
}

export interface Properties {
  Priority?: CreatedAt;
  Timeline?: CreatedAt;
  Status?: CreatedAt;
  "Created At"?: CreatedAt;
  Tags?: CreatedAt;
  Days?: CreatedAt;
  Name?: CreatedAt;
}

export interface CreatedAt {
  id?: string;
  name?: string;
  type?: string;
  created_time?: CreatedTime;
  multi_select?: Select;
  title?: CreatedTime;
  select?: Select;
  date?: CreatedTime;
}

export interface CreatedTime {}

export interface Select {
  options?: Option[];
}

export interface Option {
  id?: string;
  name?: string;
  color?: string;
}

export interface Title {
  type?: string;
  text?: Text;
  annotations?: Annotations;
  plain_text?: string;
  href?: null;
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
  link?: null;
}
