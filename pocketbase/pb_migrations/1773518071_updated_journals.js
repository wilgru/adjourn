/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407978968")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select4154440717",
    "maxSelect": 1,
    "name": "bookmarkedSortDirection",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "asc",
      "desc"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407978968")

  // update field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "select4154440717",
    "maxSelect": 1,
    "name": "bookmakredSortDirection",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "asc",
      "desc"
    ]
  }))

  return app.save(collection)
})
