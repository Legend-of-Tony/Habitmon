-- +goose Up
ALTER TABLE creatures
    ADD COLUMN palette_variant TEXT NOT NULL DEFAULT 'ocean'
    CONSTRAINT creatures_palette_variant_check
    CHECK (palette_variant IN ('ocean', 'berry', 'moss', 'sunset', 'lavender'));

-- +goose Down
ALTER TABLE creatures DROP COLUMN palette_variant;
