# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_05_17_174045) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "about_sections", force: :cascade do |t|
    t.integer "ordinal", default: 0
    t.bigint "aux_data_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "text_content"
    t.index ["aux_data_id"], name: "index_about_sections_on_aux_data_id"
  end

  create_table "admins", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_admins_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admins_on_reset_password_token", unique: true
  end

  create_table "aux_datas", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "instructions", force: :cascade do |t|
    t.text "content", default: ""
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "ordinal"
    t.bigint "recipe_id"
    t.index ["recipe_id"], name: "index_instructions_on_recipe_id"
  end

  create_table "ordered_photos", force: :cascade do |t|
    t.integer "ordinal"
    t.bigint "photo_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "ordered_imageable_type"
    t.bigint "ordered_imageable_id"
    t.index ["ordered_imageable_type", "ordered_imageable_id"], name: "index_ordered_photos_on_ordered_imageable_type_and_id"
    t.index ["photo_id"], name: "index_ordered_photos_on_photo_id"
  end

  create_table "photos", force: :cascade do |t|
    t.string "file"
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "tag"
    t.bigint "recipe_id"
    t.index ["recipe_id"], name: "index_photos_on_recipe_id"
  end

  create_table "recipes", force: :cascade do |t|
    t.string "title"
    t.string "ingredients", array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "featured", default: false
    t.string "description", default: ""
    t.bigint "photo_id"
    t.index ["photo_id"], name: "index_recipes_on_photo_id"
  end

  add_foreign_key "about_sections", "aux_datas"
  add_foreign_key "instructions", "recipes"
  add_foreign_key "ordered_photos", "photos"
end
