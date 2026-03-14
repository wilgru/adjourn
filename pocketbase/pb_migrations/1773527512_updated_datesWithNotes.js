/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_307469378")

  // update collection data
  unmarshal({
    "name": "datesWithUpdates",
    "viewQuery": "SELECT \n  (ROW_NUMBER() OVER()) as id,\n  created,\n  user\nFROM updates\nGROUP BY DATE(created)"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_wrLt")

  // remove field
  collection.fields.removeById("json234804805")

  // remove field
  collection.fields.removeById("_clone_rMZp")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_DqsE",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_nyIx",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_307469378")

  // update collection data
  unmarshal({
    "name": "datesWithUpdates",
    "viewQuery": "SELECT \n  (ROW_NUMBER() OVER()) as id,\n  created,\n  MAX(CASE WHEN isFlagged = TRUE THEN TRUE ELSE FALSE END) AS hasFlagged,\n  user\nFROM notes\nGROUP BY DATE(created)"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_wrLt",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json234804805",
    "maxSize": 1,
    "name": "hasFlagged",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_rMZp",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_DqsE")

  // remove field
  collection.fields.removeById("_clone_nyIx")

  return app.save(collection)
})
