"use client";

import { PropsWithChildren, useEffect } from "react";
import { useActionState } from "react";
import { createRouteAction } from "./action/create-route.action";
import { useToast } from "@/hooks/use-toast";

export function NewRouteForm(props: PropsWithChildren) {
  const [state, formAction] = useActionState<
    {
      error?: string;
      success?: boolean;
    } | null,
    FormData
  >(createRouteAction, null);

  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        title: state.error,
      });
    }

    if (state?.success) {
      toast({
        title: "Rota criada com sucesso!",
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      {props.children}
    </form>
  );
}
