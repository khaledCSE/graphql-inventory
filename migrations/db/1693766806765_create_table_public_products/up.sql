CREATE TABLE "public"."products" ("id" serial NOT NULL, "name" text NOT NULL, "description" text, "price" numeric NOT NULL, "stock" integer
 not null default '0', PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("name"));
