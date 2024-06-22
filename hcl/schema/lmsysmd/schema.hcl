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
  primary_key {
    columns = [column.id]
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
  foreign_key "sample_choices_sample_id" {
    columns = [column.sample_id]
    ref_columns = [table.samples.column.id]
    on_update = CASCADE
    on_delete = CASCADE
  }
}
