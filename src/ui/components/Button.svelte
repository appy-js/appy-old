<script lang="ts">
  // @ts-expect-error: svelte LS doesn't use deno yet.
  import type { ComponentType } from "npm@svelte@^3.55.0";
  import {
    ButtonType,
    ButtonVariant,
    Color,
    Props,
    Size,
    clsx,
    theme,
  } from "../index";
  import Loader from "./Loader.svelte";

  interface $$Props extends Props<HTMLButtonElement | HTMLAnchorElement> {
    /**
     * Sets the HTML class attributes.
     */
    className?: {
      root: string;
      inner: string;
      label: string;
      leftIcon: string;
      rightIcon: string;
    };

    /**
     * Sets the button color.
     */
    color?: Color;

    /**
     * Reduces the vertical and horizontal spacing.
     */
    compact?: boolean;

    /**
     * Sets the button to disabled state which disables event listeners as well.
     */
    disabled?: boolean;

    /**
     * Sets the button width to 100% of parent element.
     */
    fullWidth?: boolean;

    /**
     *
     */
    href?: string;

    /**
     * Prepend the icon to the label.
     */
    leftIcon?: ComponentType;

    /**
     * Sets the loader position.
     */
    loaderPosition?: "left" | "right";

    /**
     * Sets the loading state.
     */
    loading?: boolean;

    /**
     * Sets the border radius size.
     */
    radius?: Size;

    /**
     * Append the icon to the label.
     */
    rightIcon?: ComponentType;

    /**
     * Sets the button size.
     */
    size?: Size;

    /**
     * Sets the button HTML type, not applicable when `href` property is configured.
     */
    type?: ButtonType;

    /**
     * Sets the button appearance.
     */
    variant?: ButtonVariant;

    /**
     * Transforms the label to uppercase.
     */
    uppercase?: boolean;
  }

  const defaultSize = "sm";

  export let className: $$Props["className"] = {
    root: "",
    inner: "ai:center d:flex jc:center h:100% overflow:visible",
    label: "ai:center d:flex h:100% overflow:hidden white-space:nowrap",
    leftIcon: "ai:center d:flex mr:10",
    rightIcon: "ai:center d:flex ml:10",
  };
  export let color: $$Props["color"] = theme.primaryColor || "green";
  export let compact: $$Props["compact"] = false;
  export let disabled: $$Props["disabled"] = false;
  export let fullWidth: $$Props["fullWidth"] = false;
  export let href: $$Props["href"] = "";
  export let leftIcon: $$Props["leftIcon"] = undefined;
  export let loaderPosition: $$Props["loaderPosition"] = "left";
  export let loading: $$Props["loading"] = false;
  export let radius: $$Props["radius"] = defaultSize;
  export let rightIcon: $$Props["rightIcon"] = undefined;
  export let size: $$Props["size"] = defaultSize;
  export let type: $$Props["type"] = "button";
  export let variant: $$Props["variant"] = "filled";
  export let uppercase: $$Props["uppercase"] = false;
  const isButton = href === "";
  const sizes = {
    xs: { h: compact ? 22 : theme.inputSizes.xs, px: compact ? 7 : 14 },
    sm: { h: compact ? 26 : theme.inputSizes.sm, px: compact ? 8 : 18 },
    md: { h: compact ? 30 : theme.inputSizes.md, px: compact ? 10 : 22 },
    lg: { h: compact ? 34 : theme.inputSizes.lg, px: compact ? 12 : 26 },
    xl: { h: compact ? 40 : theme.inputSizes.xl, px: compact ? 14 : 32 },
  };
  const sizePx = sizes[size || defaultSize].px;
</script>

<!--
  @component
  Render button or link.
-->
<svelte:element
  this={isButton ? "button" : "a"}
  class={clsx(
    className?.["root"],
    "appearance:none cursor:pointer f:semibold lh:1 rel user-select:none",
    `f:${theme.fontSizes[size || defaultSize]} f:${theme.fontFamily}`,
    `h:${sizes[size || defaultSize].h}`,
    `pl:${sizePx / (leftIcon ? 1.5 : 1)} pr:${sizePx / (rightIcon ? 1.5 : 1)}`,
    `r:${theme.radiusSizes[radius || defaultSize]}`,
    `outline-offset:2:focus outline:${
      ["always", "auto"].includes(theme.focusRing)
        ? `2|solid|${theme.primaryColor}-${
            theme.colorScheme === "dark" ? 58 : 60
          }`
        : "none"
    }:focus ${
      ["auto", "never"].includes(theme.focusRing)
        ? "outline:none:focus:not(:focus-visible)"
        : ""
    }`,
    `${theme.activeClasses}:active`,
    fullWidth ? "d:block w:100%" : "d:inline-block w:auto",
    variant === "default"
      ? theme.colorScheme === "dark"
        ? "b:1|solid|fade-60 bg:fade-40 bg:fade-46:hover f:white"
        : "b:1|solid|gray-80 bg:white bg:gray-90:hover f:black"
      : "",
    variant === "filled"
      ? `b:transparent bg:${color}-60 bg:${color}-58:hover f:white`
      : "",
    variant === "light"
      ? `b:transparent bg:${color}-90 bg:${color}-88:hover f:${
          color === "fade" ? (theme.colorScheme === "dark" ? "" : "") : ""
        }`
      : ""
  )}
  disabled={isButton ? disabled : null}
  href={!isButton ? href : null}
  type={isButton ? type : null}
  on:click
  {...$$restProps}
>
  <div
    class={clsx(
      className?.["inner"],
      "ai:center d:flex h:100% jc:center overflow:visible"
    )}
  >
    {#if leftIcon || (loading && loaderPosition === "left")}
      <span class={clsx(className?.["leftIcon"])}>
        {#if loading && loaderPosition === "left"}
          <Loader />
        {:else if leftIcon}
          <svelte:component this={leftIcon} />
        {/if}
      </span>
    {/if}

    <span
      class={clsx(
        className?.["label"],
        "ai:center d:flex h:100% overflow:hidden",
        {
          uppercase: uppercase,
        }
      )}
    >
      <slot />
    </span>

    {#if rightIcon || (loading && loaderPosition === "right")}
      <span class={clsx(className?.["rightIcon"])}>
        {#if loading && loaderPosition === "right"}
          <Loader />
        {:else if rightIcon}
          <svelte:component this={rightIcon} />
        {/if}
      </span>
    {/if}
  </div>
</svelte:element>
