import { Editor } from '@tinymce/tinymce-react';
import { Field, FieldProps } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import { FILE_UPLOAD_MUTATION } from 'graphql/mutations';

interface TinyMCEEditorProps {
  name: string;
  placeholder?: string;
}

const uploadImageToBackend = async (
  file: Blob,
  filename: string
): Promise<string> => {
  const formData = new FormData();
  formData.append(
    'operations',
    JSON.stringify({
      query: FILE_UPLOAD_MUTATION,
      variables: { file: null }
    })
  );
  formData.append('map', JSON.stringify({ file: ['variables.file'] }));
  formData.append('file', file, filename);

  const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL || '', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  const result = await response.json();
  const imageUrl = result?.data?.createFileUploading?.imageUrl;
  if (!imageUrl) {
    throw new Error(result?.errors?.[0]?.message || 'Image upload failed');
  }
  return imageUrl;
};

const TinyMCEEditor = ({ name, placeholder }: TinyMCEEditorProps) => {
  const [isDark, setIsDark] = useState(false);

  // 🔥 Detect Tailwind's dark class on <html>
  useEffect(() => {
    const root = document.documentElement;

    const updateDarkMode = () => {
      setIsDark(root.classList.contains('dark'));
    };

    updateDarkMode();

    const observer = new MutationObserver(updateDarkMode);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);
  const config = useMemo(
    () => ({
      height: 400,
      menubar: true,
      placeholder: placeholder || 'Start typing...',
      file_picker_types: 'file image media',
      automatic_uploads: true,
      paste_data_images: true,
      images_file_types: 'jpg,jpeg,png,gif,webp,svg,avif',
      images_reuse_filename: true,
      images_upload_handler: (blobInfo: {
        blob: () => Blob;
        filename: () => string;
      }) => uploadImageToBackend(blobInfo.blob(), blobInfo.filename()),
      file_picker_callback: (
        cb: (url: string, meta?: Record<string, string>) => void,
        _value: string,
        meta: Record<string, unknown>
      ) => {
        if (meta.filetype !== 'image') return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          try {
            const url = await uploadImageToBackend(file, file.name);
            // Pre-fill alt text from filename; user can edit it in the
            // dialog's "Alternative description" field before inserting
            const defaultAlt = file.name
              .replace(/\.[^.]+$/, '')
              .replace(/[-_]+/g, ' ');
            cb(url, { alt: defaultAlt, title: defaultAlt });
          } catch (err) {
            alert(
              err instanceof Error ? err.message : 'Image upload failed'
            );
          }
        };
        input.click();
      },
      image_advtab: true,
      image_description: true,
      image_dimensions: true,
      image_caption: true,
      image_title: true,
      autosave_interval: '10s',
      a11y_advanced_options: true,
      quickbars_insert_toolbar: true,
      nonbreaking_force_tab: true,
      allow_html_in_named_anchor: true,
      quickbars_image_toolbar:
        'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',
      skin: isDark ? 'oxide-dark' : 'oxide',
      content_css: isDark ? 'dark' : 'default',
      plugins: [
        'advlist',
        'autolink',
        'accordion',
        'quickbars',
        'autosave',
        'link',
        'image',
        'lists',
        'charmap',
        'preview',
        'anchor',
        'pagebreak',
        'searchreplace',
        'wordcount',
        'visualblocks',
        'visualchars',
        'code',
        'fullscreen',
        'insertdatetime',
        'quickbars',
        'media',
        'table',
        'emoticons',
        'help',
        'directionality',
        'nonbreaking'
      ],
      toolbar1:
        'undo redo | blocks | fontsize | styles | nonbreaking | bold italic | accordion | ltr rtl | quickimage | quicktable ',
      toolbar2:
        'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullscreen | forecolor backcolor emoticons | anchor | restoredraft | help',
      menu: {
        file: {
          title: 'File',
          items:
            'newdocument restoredraft | preview | print | deleteallconversations'
        },
        edit: {
          title: 'Edit',
          items:
            'undo redo | cut copy paste pastetext | selectall | searchreplace'
        },
        view: {
          title: 'View',
          items:
            'code revisionhistory | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments'
        },
        insert: {
          title: 'Insert',
          items:
            'image link media addcomment pageembed codesample inserttable | math | charmap emoticons hr | pagebreak nonbreaking anchor tableofcontents | insertdatetime'
        },
        format: {
          title: 'Format',
          items:
            'bold italic underline strikethrough superscript subscript codeformat | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat'
        },
        tools: {
          title: 'Tools',
          items: 'spellchecker spellcheckerlanguage | a11ycheck code wordcount'
        },
        table: {
          title: 'Table',
          items:
            'inserttable | cell row column | advtablesort | tableprops deletetable'
        },
        help: { title: 'Help', items: 'help' }
      },
      contextmenu: [
        'cut copy paste | link image inserttable | image | tableprops deletetable | cell row column',
        'bold italic underline | removeformat | forecolor backcolor',
        'insertdatetime emoticons | code'
      ]
    }),
    [placeholder, isDark]
  );

  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => (
        <Editor
          key={isDark ? 'dark' : 'light'}
          apiKey={process.env.NEXT_PUBLIC_TINY_API}
          value={field.value}
          onEditorChange={(content) => form.setFieldValue(name, content)}
          init={config}
        />
      )}
    </Field>
  );
};

export default TinyMCEEditor;
