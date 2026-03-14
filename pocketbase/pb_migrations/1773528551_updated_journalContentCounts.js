/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2337689436")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  j.id AS journal,\n  j.user AS user,\n  COUNT(DISTINCT n.id) AS noteCount,\n  COUNT(DISTINCT t.id) AS taskCount,\n  COUNT(DISTINCT u.id) AS updateCount,\n  COUNT(DISTINCT CASE WHEN n.isBookmarked = TRUE THEN n.id END) AS bookmarkedCount\nFROM journals j\nLEFT JOIN notes n\n  ON n.journal = j.id\nLEFT JOIN tasks t\n  ON t.journal = j.id\nLEFT JOIN updates u\n  ON u.journal = j.id\nGROUP BY\n  j.id"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_ucAL")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_fJm4",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "number2835438237",
    "max": null,
    "min": null,
    "name": "bookmarkedCount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2337689436")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  (ROW_NUMBER() OVER()) as id,\n  j.id AS journal,\n  j.user AS user,\n  COUNT(DISTINCT n.id) AS noteCount,\n  COUNT(DISTINCT t.id) AS taskCount,\n  COUNT(DISTINCT u.id) AS updateCount\nFROM journals j\nLEFT JOIN notes n\n  ON n.journal = j.id\nLEFT JOIN tasks t\n  ON t.journal = j.id\nLEFT JOIN updates u\n  ON u.journal = j.id\nGROUP BY\n  j.id"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_ucAL",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_fJm4")

  // remove field
  collection.fields.removeById("number2835438237")

  return app.save(collection)
})
