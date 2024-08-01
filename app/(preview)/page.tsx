/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { ObjectIcon, VercelIcon } from "@/components/icons";
import { experimental_useObject } from "ai/react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { Expense, expenseSchema, PartialExpense } from "@/app/api/chat/schema";

const ExpenseView = ({ expense }: { expense: Expense | PartialExpense }) => {
  return (
    <motion.div
      className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-row gap-4 w-full">
        <div className="text-zinc-400 dark:text-zinc-400 w-16">
          {expense?.date}
        </div>
        <div className="text-zinc-800 dark:text-zinc-300 flex-1 capitalize flex flex-row gap-2 items-center">
          <div>{expense?.details}</div>
          <div className="flex flex-row gap-2 size-6">
            {expense?.participants?.map((participant) => (
              <img
                className="size-full rounded-full"
                src={`https://vercel.com/api/www/avatar?u=${participant}&s=64`}
                alt={participant}
              />
            ))}
          </div>
        </div>
        <div className="text-zinc-600 dark:text-zinc-300 text-xs bg-zinc-200 rounded-md flex flex-row items-center p-1 font-medium capitalize h-fit dark:bg-zinc-700 dark:text-zinc-300">
          {expense?.category?.toLowerCase()}
        </div>
        <div className="text-emerald-600 dark:text-emerald-400 w-8 text-right">
          ${expense?.amount}
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const { submit, isLoading, object } = experimental_useObject({
    api: "/api/chat",
    schema: expenseSchema,
    onFinish({ object }) {
      if (object != null) {
        setExpenses((prev) => [object.expense, ...prev]);
        setInput("");
        inputRef.current?.focus();
      }
    },
    onError: () => {
      toast.error("You've been rate limited, please try again later!");
    },
  });

  return (
    <div className="flex flex-row justify-center pt-20 h-dvh bg-white dark:bg-zinc-900">
      <div className="flex flex-col justify-between gap-4">
        <form
          className="flex flex-col gap-2 relative items-center"
          onSubmit={(event) => {
            event.preventDefault();

            const form = event.target as HTMLFormElement;

            const input = form.elements.namedItem(
              "expense"
            ) as HTMLInputElement;

            if (input.value.trim()) {
              submit({ expense: input.value });
            }
          }}
        >
          <input
            name="expense"
            className="bg-zinc-100 rounded-md px-2 py-1.5 w-full outline-none dark:bg-zinc-700 text-zinc-800 dark:text-zinc-300 md:max-w-[500px] max-w-[calc(100dvw-32px)] disabled:text-zinc-400 disabled:cursor-not-allowed placeholder:text-zinc-400"
            placeholder="Expense a transaction..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            disabled={isLoading}
            ref={inputRef}
          />
        </form>

        {expenses.length > 0 || isLoading ? (
          <div className="flex flex-col gap-2 h-full w-dvw items-center">
            {isLoading && object?.expense && (
              <div className="opacity-50">
                <ExpenseView expense={object.expense} />
              </div>
            )}

            {expenses.map((expense) => (
              <ExpenseView key={`${expense.details}`} expense={expense} />
            ))}
          </div>
        ) : (
          <motion.div className="h-[350px] px-4 w-full md:w-[500px] md:px-0 pt-20">
            <div className="border rounded-lg p-6 flex flex-col gap-4 text-zinc-500 text-sm dark:text-zinc-400 dark:border-zinc-700">
              <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                <VercelIcon />
                <span>+</span>
                <ObjectIcon />
              </p>
              <p>
                The useObject hook allows you to create interfaces that
                represent a structured JSON object that is being streamed.
              </p>
              <p>
                {" "}
                Learn more about the{" "}
                <Link
                  className="text-blue-500 dark:text-blue-400"
                  href="https://sdk.vercel.ai/docs/ai-sdk-ui/object-generation"
                  target="_blank"
                >
                  useObject{" "}
                </Link>
                hook from Vercel AI SDK.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
