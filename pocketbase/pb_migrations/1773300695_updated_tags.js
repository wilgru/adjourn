/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1582199508",
    "maxSelect": 1,
    "name": "sortBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "created",
      "alphabetical"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select1372728543",
    "maxSelect": 1,
    "name": "sortDirection",
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
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // remove field
  collection.fields.removeById("select1582199508")

  // remove field
  collection.fields.removeById("select1372728543")

  return app.save(collection)
})
