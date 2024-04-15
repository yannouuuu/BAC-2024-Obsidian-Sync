import type { NavGroup, NavItem, ThemeConfig } from "@portaljs/core";
import { pageview, SearchProvider, ThemeProvider } from "@portaljs/core";
import { DefaultSeo } from "next-seo";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

import { Layout } from "@/components/Layout";
import siteConfig from "@/config/siteConfig";

import "@/styles/docsearch.css";
import "@/styles/global.css";
import "@/styles/prism.css";
import { Analytics } from "@portaljs/core";
import "tailwindcss/tailwind.css";

export interface CustomAppProps {
    meta: {
        showToc: boolean;
        showEditLink: boolean;
        showSidebar: boolean;
        showComments: boolean;
        urlPath: string; // not sure what's this for
        editUrl?: string;
        [key: string]: any;
    };
    siteMap?: Array<NavItem | NavGroup>;
    [key: string]: any;
}

const MyApp = ({ Component, pageProps }: AppProps<CustomAppProps>) => {
    const router = useRouter();
    const { meta, siteMap } = pageProps;

    const layoutProps = {
        showToc: meta?.showToc,
        showEditLink: meta?.showEditLink,
        showSidebar: meta?.showSidebar,
        showComments: meta?.showComments,
        editUrl: meta?.editUrl,
        urlPath: meta?.urlPath,
        // @ts-ignore
        commentsConfig: siteConfig.comments,
        nav: {
            // @ts-ignore
            title: siteConfig.navbarTitle?.text ?? siteConfig.title,
            // @ts-ignore
            logo: siteConfig.navbarTitle?.logo,
            links: siteConfig.navLinks,
            // @ts-ignore
            search: siteConfig.search,
            // @ts-ignore
            social: siteConfig.social,
        },
        author: {
            name: siteConfig.author,
            url: siteConfig.domain,
            // @ts-ignore
            logo: siteConfig.logo,
        },
        theme: {
            defaultTheme: siteConfig.theme.default,
            themeToggleIcon: siteConfig.theme.toggleIcon,
        } as ThemeConfig,
        siteMap,
    };

    useEffect(() => {
        if (siteConfig.analytics) {
            const handleRouteChange = (url) => {
                pageview(url);
            };
            router.events.on("routeChangeComplete", handleRouteChange);
            return () => {
                router.events.off("routeChangeComplete", handleRouteChange);
            };
        }
    }, [router.events]);

    return (
        <ThemeProvider
            disableTransitionOnChange
            attribute="class"
            defaultTheme={siteConfig.theme.default}
            forcedTheme={siteConfig.theme.default ? null : "light"}
        >
            <DefaultSeo
                defaultTitle={siteConfig.title}
                // @ts-ignore
                {...siteConfig.nextSeo}
            />
            {
                // @ts-ignore
                siteConfig.analyticsConfig && (
                    // @ts-ignore
                    <Analytics analyticsConfig={siteConfig.analyticsConfig} />
                )
            }
            {/*For compatibility, keep this.*/}
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            {siteConfig.analytics && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.analytics}`}
                    />
                    <Script
                        id="gtag-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${siteConfig.analytics}', {
                page_path: window.location.pathname,
              });
            `,
                        }}
                    />
                </>
            )}
            <SearchProvider
                searchConfig={
                    // @ts-ignore
                    siteConfig.search
                }
            >
                <Layout {...layoutProps}>
                    <Component {...pageProps} />
                </Layout>
            </SearchProvider>
        </ThemeProvider>
    );
};

export default MyApp;
