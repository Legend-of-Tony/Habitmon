-- +goose Up
ALTER TABLE creatures
    ALTER COLUMN tail_variant DROP NOT NULL,
    ADD COLUMN horn_variant TEXT
        CONSTRAINT creatures_horn_variant_check
        CHECK (horn_variant IN ('horn_1'));

-- Preserve the appearance of creatures generated before horns became optional.
UPDATE creatures SET horn_variant = 'horn_1';

-- +goose Down
UPDATE creatures SET tail_variant = 'tail_1' WHERE tail_variant IS NULL;

ALTER TABLE creatures
    ALTER COLUMN tail_variant SET NOT NULL,
    DROP COLUMN horn_variant;
