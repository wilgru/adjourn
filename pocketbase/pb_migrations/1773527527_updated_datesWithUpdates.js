/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_307469378")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  (ROW_NUMBER() OVER()) as id,\n  created,\n  journal,\n  user\nFROM updates\nGROUP BY DATE(created)"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_DqsE")

  // remove field
  collection.fields.removeById("_clone_nyIx")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "_clone_zVgI",
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
    "collectionId": "pbc_1407978968",
    "hidden": false,
    "id": "_clone_Fo86",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "journal",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_NKXU",
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
    "viewQuery": "SELECT \n  (ROW_NUMBER() OVER()) as id,\n  created,\n  user\nFROM updates\nGROUP BY DATE(created)"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_zVgI")

  // remove field
  collection.fields.removeById("_clone_Fo86")

  // remove field
  collection.fields.removeById("_clone_NKXU")

  return app.save(collection)
})
