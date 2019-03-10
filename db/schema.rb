# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20181130090719) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.string "siret"
    t.datetime "invalid_at"
    t.datetime "valid_at"
    t.boolean "is_valid", default: false
    t.string "kbis"
    t.string "urssaf"
    t.string "lnte"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "rails"
    t.string "g"
    t.string "migration"
    t.string "add_fields_to_company"
    t.string "efetcent"
    t.string "l6_declaree"
    t.string "l6_normalisee"
    t.string "libtefen"
    t.string "iriset"
    t.string "libcom"
    t.string "typvoie"
    t.string "dapet"
    t.string "dcren"
    t.string "l1_normalisee"
    t.string "epci"
    t.string "ddebact"
    t.string "categorie"
    t.string "tcd"
    t.string "modet"
    t.string "libtefet"
    t.string "proden"
    t.string "libtu"
    t.string "siren"
    t.string "nom_dept"
    t.string "defet"
    t.string "apet700"
    t.string "depcomet"
    t.string "section"
    t.string "tu"
    t.string "libvoie"
    t.string "defen"
    t.string "libapet"
    t.string "depcomen"
    t.string "amintret"
    t.string "code_section"
    t.string "l4_normalisee"
    t.string "prodet"
    t.string "libactivnat"
    t.string "nomen_long"
    t.string "codpos"
    t.string "monoact"
    t.string "code_classe"
    t.string "l4_declaree"
    t.string "amintren"
    t.string "apen700"
    t.string "siege"
    t.string "nic"
    t.string "tefet"
    t.string "libreg_new"
    t.string "nj"
    t.string "libmonoact"
    t.string "numvoie"
    t.string "nicsiege"
    t.string "libmodet"
    t.string "libmoden"
    t.string "lieuact"
    t.string "diffcom"
    t.string "dcret"
    t.string "du"
    t.string "coordonnees"
    t.string "depet"
    t.string "code_division"
    t.string "code_groupe"
    t.string "datemaj"
    t.string "dapen"
    t.string "l7_normalisee"
    t.string "l1_declaree"
    t.string "activnat"
    t.string "uu"
    t.string "activite"
    t.string "libnj"
    t.string "tefen"
    t.string "efencent"
    t.string "rpen"
    t.string "origine"
    t.string "libapen"
    t.string "zemet"
    t.string "arronet"
    t.string "saisonat"
    t.string "rpet"
    t.string "sous_classe"
    t.string "moden"
    t.string "comet"
    t.string "auxilt"
    t.string "ind_publipo"
    t.string "liborigine"
    t.string "aprm"
    t.string "ctonet"
    t.string "l2_normalisee"
    t.string "l3_normalisee"
    t.string "l3_declaree"
    t.string "enseigne"
    t.string "l2_declaree"
    t.string "sigle"
    t.string "indrep"
    t.string "l5_declaree"
    t.string "tca"
    t.string "esaapen"
    t.string "esaann"
    t.string "esasec1n"
    t.string "libesaapen"
    t.string "libtca"
    t.string "actisurf"
  end

  create_table "interlocutors", force: :cascade do |t|
    t.string "first_name", default: ""
    t.string "last_name", default: ""
    t.boolean "man", default: false
    t.string "email", default: ""
    t.string "position", default: ""
    t.boolean "privileged", default: true
    t.bigint "company_id"
    t.bigint "supplier_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_interlocutors_on_company_id"
    t.index ["supplier_id"], name: "index_interlocutors_on_supplier_id"
  end

  create_table "suppliers", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "company_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_suppliers_on_company_id"
    t.index ["user_id"], name: "index_suppliers_on_user_id"
  end

  create_table "user_roles", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.bigint "company_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name", default: ""
    t.string "last_name", default: ""
    t.integer "parent_id"
    t.bigint "user_role_id"
    t.index ["company_id"], name: "index_users_on_company_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["user_role_id"], name: "index_users_on_user_role_id"
  end

  add_foreign_key "interlocutors", "companies"
  add_foreign_key "interlocutors", "suppliers"
  add_foreign_key "suppliers", "companies"
  add_foreign_key "suppliers", "users"
  add_foreign_key "users", "companies"
  add_foreign_key "users", "user_roles"
end
