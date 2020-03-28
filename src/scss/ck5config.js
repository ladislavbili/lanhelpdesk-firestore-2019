const ckconfig = {
  toolbar: [ 'heading', '|', 'bold', 'italic','underline', 'striketrough', 'link','alignment', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo'   ],
  alignment: {
    options: [ 'left', 'right', 'center' ]
  },
  format_tags:  'p;h1;h2;h3;h4;h5;h6;pre;address;div' ,
  format_h1: {
    element: 'h1',
    attributes: {
      'style' : 'font-family: Segoe UI; margin-bottom: 0px; padding-bottom: 0px; margin-top: 0px; padding-top: 0px; color: red '
    }
  },
  format_p: {
    element: 'p',
    attributes: {
      'style' : 'font-family: Segoe UI; margin-bottom: 0px; padding-bottom: 0px; margin-top: 0px; padding-top: 0px;'
    }
  },
  format_pre: {
    element: 'pre',
    attributes: {
      'style' : 'color: red; font-family: Segoe UI;'
    }
  }
}
export default ckconfig;
