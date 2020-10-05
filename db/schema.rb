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

ActiveRecord::Schema.define(version: 2020_10_05_091444) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

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
    t.text "about_page_paragraphs", array: true
    t.integer "photo_page_ordered_ids", array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "about_page_sections", array: true
  end

  create_table "photos", force: :cascade do |t|
    t.string "file"
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "recipes", force: :cascade do |t|
    t.string "title"
    t.string "ingredients", array: true
    t.text "paragraphs", array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "photo_id"
  end

  create_table "sections", force: :cascade do |t|
    t.integer "ordered_photo_ids", array: true
    t.integer "recipe_id"
    t.text "text_content"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
