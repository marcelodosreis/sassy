import { ArrowLeftIcon } from '@heroicons/react/24/solid';

type BackLinkProps = {
    href: string;
    label: string;
};

export default function BackLink(props: BackLinkProps) {
    const { href, label } = props;
    
    return (
        <a href={href} className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            {label}
        </a>
    );
}