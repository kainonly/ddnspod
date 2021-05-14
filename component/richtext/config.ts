export const TinymceConfig: any = {
  height: 500,
  plugins: [
    'paste', 'searchreplace', 'autolink', 'visualblocks', 'visualchars', 'fullscreen', 'help', 'quickbars',
    'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'toc', 'insertdatetime', 'emoticons',
    'advlist', 'lists', 'textpattern', 'noneditable', 'charmap', 'link', 'importcss',
    'image', 'imagetools', 'media'
  ],
  menu: {
    file: { title: 'File', items: 'newdocument' },
    edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
    view: { title: 'View', items: 'visualaid visualchars visualblocks | fullscreen' },
    insert: {
      title: 'Insert',
      items: 'image link media codesample inserttable | charmap emoticons hr | pagebreak nonbreaking toc | insertdatetime'
    },
    format: {
      title: 'Format',
      items: 'bold italic underline strikethrough superscript subscript codeformat | ' +
        'formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat'
    },
    table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' },
    image_advtab: true,
    help: { title: 'Help', items: 'help' }
  },
  toolbar: [
    'formatselect fontsizeselect | outdent indent | alignleft aligncenter alignright alignjustify | fullscreen',
    'bold italic underline strikethrough | forecolor backcolor removeformat | numlist bullist | NgPicture NgVideo link'
  ],
  toolbar_mode: 'sliding',
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  quickbars_insert_toolbar: 'quicktable',
  contextmenu: 'link image imagetools table configurepermanentpen',
  toolbar_sticky: true,
  image_advtab: true,
  fullscreen_native: true,
  importcss_append: true
};
