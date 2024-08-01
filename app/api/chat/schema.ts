import { DeepPartial } from "ai";
import { z } from "zod";

export const expenseSchema = z.object({
  expense: z.object({
    category: z
      .string()
      .describe(
        "Category of the expense. Allowed categories: TRAVEL, MEALS, ENTERTAINMENT, OFFICE SUPPLIES, OTHER."
      ),
    amount: z.number().describe("Amount of the expense in USD."),
    date: z.string().describe("Date of the expense, in dd-MMM format."),
    details: z.string().describe("Name of the product or service."),
    participants: z
      .array(z.string())
      .describe("Participants in the expense, as usernames."),
  }),
});

// define a type for the partial notifications during generation
export type PartialExpense = DeepPartial<typeof expenseSchema>["expense"];

export type Expense = z.infer<typeof expenseSchema>["expense"];
