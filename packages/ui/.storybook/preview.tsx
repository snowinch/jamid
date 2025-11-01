import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "../src/utils/theme";
import "../src/styles/globals.css";

const preview: Preview = {
    decorators: [
        (Story) => (
            <ThemeProvider>
                <Story />
            </ThemeProvider>
        ),
    ],
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
                {
                    name: "gray",
                    value: "#f9fafb",
                },
            ],
        },
    },
};

export default preview;
