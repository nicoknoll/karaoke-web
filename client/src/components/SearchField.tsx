import { useCallback, useEffect, useRef } from 'react';

const SearchField = ({ value, onChange, onKeyDown, onKeyUp }: any) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInputField = useCallback(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // This field should never lose focus - and if it does, it should be focused again
    useEffect(() => {
        document.addEventListener('visibilitychange', focusInputField);
        document.addEventListener('focus', focusInputField);
        document.addEventListener('click', focusInputField);
        document.addEventListener('keydown', focusInputField);
        return () => {
            document.removeEventListener('visibilitychange', focusInputField);
            document.removeEventListener('focus', focusInputField);
            document.removeEventListener('click', focusInputField);
            document.removeEventListener('keydown', focusInputField);
        };
    }, [focusInputField]);

    return (
        <div className="flex items-center gap-2">
            <input
                ref={inputRef}
                className="flex-1 rounded-3xl bg-neutral-950 px-10 py-8 text-5xl font-semibold text-white placeholder-neutral-700 focus:outline-none"
                value={value}
                onChange={onChange}
                onBlur={() => {
                    setTimeout(() => {
                        inputRef.current?.focus();
                    }, 1);
                }}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                autoFocus
                placeholder="Suchbegriff oder Song-ID"
            />
        </div>
    );
};

export default SearchField;
