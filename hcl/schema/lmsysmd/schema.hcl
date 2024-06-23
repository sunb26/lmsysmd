schema "public" {
  comment = "standard public schema"
}
table "samples" {
  schema = schema.public
  column "id" {
    null = false
    type = serial
  }
  column "content" {
    null = false
    type = text
  }
  column "truth" {
    null = false
    type = text
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  column "sampleset_id" {
    null = true
    type = integer
  }
  primary_key {
    columns = [column.id]
  }
  index "samples_sampleset_id_id" {
    columns = [column.sampleset_id, column.id]
  }
  foreign_key "samples_sampleset_id" {
    columns = [column.sampleset_id]
    ref_columns = [table.samplesets.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
}
table "sample_choices" {
  schema = schema.public
  column "id" {
    null = false
    type = serial
  }
  column "sample_id" {
    null = false
    type = integer
  }
  column "content" {
    null = false
    type = text
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  primary_key {
    columns = [column.sample_id, column.id]
  }
  unique "sample_choices_id" {
    columns = [column.id]
  }
  foreign_key "sample_choices_sample_id" {
    columns = [column.sample_id]
    ref_columns = [table.samples.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
}
table "ratings" {
  schema = schema.public
  column "id" {
    null = false
    type = serial
  }
  column "user_id" {
    null = false
    type = text
  }
  column "sample_id" {
    null = false
    type = integer
  }
  column "choice_id" {
    null = false
    type = integer
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  primary_key {
    columns = [column.user_id, column.id]
  }
  unique "ratings_id" {
    columns = [column.id]
  }
  foreign_key "ratings_sample_id" {
    columns = [column.sample_id]
    ref_columns = [table.samples.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
  foreign_key "ratings_choices_id" {
    columns = [column.choice_id]
    ref_columns = [table.sample_choices.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
}
table "rating_states" {
  schema = schema.public
  column "id" {
    null = false
    type = serial
  }
  column "user_id" {
    null = false
    type = text
  }
  column "rating_id" {
    null = false
    type = integer
  }
  column "state" {
    null = false
    type = text
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  primary_key {
    columns = [column.user_id, column.rating_id, column.id]
  }
  foreign_key "rating_states_rating_id" {
    columns = [column.rating_id]
    ref_columns = [table.ratings.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
}
table "samplesets" {
  schema = schema.public
  column "id" {
    null = false
    type = serial
  }
  column "model_id" {
    null = false
    type = text
  }
  column "task_id" {
    null = false
    type = text
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "samplesets_model_id" {
    columns = [column.model_id]
    ref_columns = [table.models.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
  foreign_key "samplesets_task_id" {
    columns = [column.task_id]
    ref_columns = [table.tasks.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
}
table "models" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "display_name" {
    null = false
    type = text
  }
  column "release_date" {
    null = false
    type = timestamptz
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  column "vendor_id" {
    null = false
    type = text
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "models_vendor_id" {
    columns = [column.vendor_id]
    ref_columns = [table.model_vendors.column.id]
    on_update = CASCADE
    on_delete = RESTRICT
  }
}
table "model_vendors" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  primary_key {
    columns = [column.id]
  }
}
table "tasks" {
  schema = schema.public
  column "id" {
    null = false
    type = text
  }
  column "display_name" {
    null = false
    type = text
  }
  column "create_time" {
    null = false
    type = timestamptz
  }
  primary_key {
    columns = [column.id]
  }
}
