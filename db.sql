--Script to create the Postgres structure to store the contacts

-- Table: public.contacts

-- DROP TABLE public.contacts;

CREATE TABLE public.contacts
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    email character varying COLLATE pg_catalog."default" NOT NULL
)

TABLESPACE pg_default;

