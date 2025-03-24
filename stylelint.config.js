export default {
    extends: [
        "stylelint-config-standard",
        "stylelint-config-recommended-vue"
    ],
    overrides: [
        {
            files: ["**/*.vue"],
            customSyntax: "postcss-html"
        }
    ]
};
