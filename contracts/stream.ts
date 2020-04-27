export interface IStream {
  next: Function;
  peek: Function;
  eof: Function;
  croak?: Function;
} 