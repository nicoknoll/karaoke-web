import { classnames } from '../utils/classnames';

const Key = ({ children, selected, theme = 'dark' }: any) => {
    return (
        <span
            className={classnames(
                'rounded-md px-3 py-1',
                theme == 'dark' && 'bg-neutral-800 text-white',
                theme == 'light' && 'bg-neutral-200 text-black',
                selected && theme == 'dark' && 'bg-neutral-700',
                selected && theme == 'light' && 'bg-neutral-300'
            )}
        >
            {children}
        </span>
    );
};

export default Key;
