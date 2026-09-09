-- +goose Up
CREATE TABLE creatures (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp BIGINT NOT NULL DEFAULT 0 CHECK (xp >= 0),
    ear_variant TEXT NOT NULL CHECK (ear_variant IN ('ear_1', 'ear_2', 'ear_3')),
    tail_variant TEXT NOT NULL CHECK (tail_variant IN ('tail_1', 'tail_2')),
    eye_index INT NOT NULL CHECK (eye_index BETWEEN 0 AND 15),
    mouth_index INT NOT NULL CHECK (mouth_index BETWEEN 0 AND 15),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT creatures_user_id_key UNIQUE (user_id)
);

-- +goose Down
DROP TABLE creatures;
