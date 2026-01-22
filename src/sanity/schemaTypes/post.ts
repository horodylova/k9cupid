import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          validation: Rule => Rule.required(),
          options: {
            isHighlighted: true
          }
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: Rule => Rule.required(),
              options: {
                isHighlighted: true
              }
            },
            {
              name: 'position',
              type: 'string',
              title: 'Position',
              options: {
                list: [
                  { title: 'Center (Full Width)', value: 'center' },
                  { title: 'Left (Float)', value: 'left' },
                  { title: 'Right (Float)', value: 'right' }
                ],
                layout: 'radio',
                isHighlighted: true
              },
              initialValue: 'center'
            }
          ]
        },
        defineField({
            name: 'textWithIllustration',
            title: 'Text with Illustration (Row)',
            type: 'object',
            fields: [
                defineField({
                    name: 'heading',
                    type: 'string',
                    title: 'Heading (Optional)'
                }),
                defineField({
                    name: 'text',
                    type: 'array',
                    title: 'Content',
                    of: [{type: 'block'}]
                }),
                defineField({
                    name: 'image',
                    type: 'image',
                    title: 'Image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative Text',
                            validation: Rule => Rule.required(),
                            options: {
                                isHighlighted: true
                            }
                        }
                    ]
                }),
                defineField({
                    name: 'imagePosition',
                    type: 'string',
                    title: 'Image Position',
                    options: {
                        list: [
                            { title: 'Right', value: 'right' },
                            { title: 'Left', value: 'left' }
                        ],
                        layout: 'radio'
                    },
                    initialValue: 'right'
                })
            ],
            preview: {
                select: {
                    title: 'heading',
                    media: 'image'
                },
                prepare({title, media}) {
                    return {
                        title: title || 'Text with Illustration',
                        subtitle: 'Row Layout',
                        media
                    }
                }
            }
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection
      return { ...selection, subtitle: author && `by ${author}` }
    },
  },
})
