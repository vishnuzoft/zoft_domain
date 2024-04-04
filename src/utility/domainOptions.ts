export function generateDomainOptions(domains: string[], extensions: string[]): string[] {
    const domainOptions: string[] = [];
    domains.forEach(domain => {
        extensions.forEach(extension => {
            domainOptions.push(`${domain.toLowerCase()}${extension}`);
        });
    });

    return domainOptions;
}