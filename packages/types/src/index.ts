import z from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should atleast be 3 characters" })
    .max(25, { message: "at max 25 characters allowed" }),

  // TODO: can add password criteria later on
  password: z
    .string()
    .min(6, { message: "Password should atleast be 6 characters" }),

  type: z.enum(["user", "admin"], {
    message: "Invalid role",
  }),
});

export const SignInSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username should atleast be 3 characters" })
    .max(25, { message: "at max 25 characters allowed" }),

  password: z
    .string()
    .min(6, { message: "Password should atleast be 6 characters" }),
});

export const CreateAvatarSchema = z.object({
  imageUrl: z.string().min(1),
  name: z
    .string()
    .min(3, { message: "Name should be atleast of 3 characters" }),
});

export const UpdateMetadataSchema = z.object({
  avatarId: z.string().min(1),
});
