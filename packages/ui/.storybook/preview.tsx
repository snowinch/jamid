import type { Preview } from "@storybook/react";
import { ThemeProvider } from "../src/utils/theme";
import "../src/styles/globals.css";
import React, { useEffect } from "react";

const withTheme = (Story: any, context: any) => {
    const theme = context.globals.theme || "light";

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(theme);
    }, [theme]);

    return (
        <div className={theme}>
            <div className="bg-background text-foreground min-h-screen">
                <Story />
            </div>
        </div>
    );
};

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: "light",
            values: [
                {
                    name: "light",
                    value: "#ffffff",
                },
                {
                    name: "dark",
                    value: "#000000",
                },
            ],
        },
    },
    globalTypes: {
        theme: {
            name: "Theme",
            description: "Global theme for components",
            defaultValue: "light",
            toolbar: {
                icon: "circlehollow",
                items: [
                    { value: "light", icon: "sun", title: "Light" },
                    { value: "dark", icon: "moon", title: "Dark" },
                ],
                showName: true,
                dynamicTitle: true,
            },
        },
    },
    decorators: [withTheme],
};

export default preview;

