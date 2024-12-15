'use client';

import { PropsWithChildren, useActionState } from "react";
import { createRouteAction } from "./action/create-route.action";

export function NewRouteForm(props: PropsWithChildren) {
    const [state, formAction] = useActionState<
        {
        error?: string;
        success?: boolean;
        } | null,
        FormData
    >(createRouteAction, null);
    return (
        <form action={formAction}>
            {state?.error && (
                <div className="p-4 border rounded text-contrast bg-red-500">
                {state.error}
                </div>
            )}
            {state?.success && (
                <div className="p-4 border rounded text-contrast bg-green-500">
                Rota criada com sucesso!
                </div>
            )}
            {props.children}
        </form>
    );
}