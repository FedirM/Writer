
ClassicEditor.create( document.querySelector( '.editor' ), {
    toolbar: {
        viewportTopOffset : 0,
        items: [
            'heading',
            '|',
            'undo',
            'redo',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'indent',
            'outdent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed'
        ]
    },
    language: 'en',
    image: {
        toolbar: [
            'imageTextAlternative',
            'imageStyle:full',
            'imageStyle:side'
        ]
    },
    table: {
        contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells'
        ]
    },
    licenseKey: '',
} )
.then( editor => {
    window.editor = editor;
}).catch( error => {
    console.error( 'Oops, something went wrong!' );
    console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
    console.warn( 'Build id: 9x3ve0vzsv96-n6ygjjj1yvc6' );
    console.error( error );
} );
