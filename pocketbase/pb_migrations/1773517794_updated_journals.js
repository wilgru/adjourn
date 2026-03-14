/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407978968")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select1227715550",
    "maxSelect": 1,
    "name": "notesSortBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "alphabetical",
      "created"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select765641359",
    "maxSelect": 1,
    "name": "notesSortDirection",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "asc",
      "desc"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select2377234365",
    "maxSelect": 1,
    "name": "notesGroupBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "created",
      "tag"
    ]
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select1935689031",
    "maxSelect": 1,
    "name": "bookmarkedSortBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "alphabetical",
      "created"
    ]
  }))

  // add field
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

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select72929643",
    "maxSelect": 1,
    "name": "bookmarkedGroupBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "created",
      "tag"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1407978968")

  // remove field
  collection.fields.removeById("select1227715550")

  // remove field
  collection.fields.removeById("select765641359")

  // remove field
  collection.fields.removeById("select2377234365")

  // remove field
  collection.fields.removeById("select1935689031")

  // remove field
  collection.fields.removeById("select4154440717")

  // remove field
  collection.fields.removeById("select72929643")

  return app.save(collection)
})
