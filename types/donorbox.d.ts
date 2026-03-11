declare namespace JSX {
  interface IntrinsicElements {
    'dbox-widget': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        campaign?: string;
        type?: string;
        'enable-auto-scroll'?: string;
      },
      HTMLElement
    >;
  }
}
