/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json2029409178",
    "maxSize": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("35y5ayizwh2c9fk")

  // update field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json2029409178",
    "maxSize": 0,
    "name": "badges",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
