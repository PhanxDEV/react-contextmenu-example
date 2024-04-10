import {
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import styles from './ContextMenu.module.css';

type Props = {
    id: string;
    items: ContextMenuItem[];
    onItemClicked: (item: ContextMenuItem) => void;
};

export type ContextMenuItem = {
    id: string;
    caption: string;
};

const ContextMenu = (props: PropsWithChildren<Props>) => {
    const { items, children, id, onItemClicked } = props;

    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const ref = useRef<HTMLUListElement>(null);

    const contextMenuHandler = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsVisible(true);
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.code == 'Escape') {
            setIsVisible(false);
        }
    };

    const clickHandler = useCallback(
        (e: MouseEvent) => {
            if (isVisible) {
                const rect = ref.current?.getBoundingClientRect();
                if (rect) {
                    if (
                        e.clientX < rect.left ||
                        e.clientX > rect.right ||
                        e.clientY > rect.top ||
                        e.clientY < rect.bottom
                    ) {
                        setIsVisible(false);
                    }
                }
            }
        },
        [isVisible]
    );

    const customContextMenuOpenedHandler = useCallback(
        (e: Event) => {
            if ((e as CustomEvent<string>).detail != id) {
                setIsVisible(false);
            }
        },
        [id]
    );

    useEffect(() => {
        document.addEventListener(
            'contextMenuOpened',
            customContextMenuOpenedHandler
        );

        return () => {
            document.removeEventListener(
                'contextMenuOpened',
                customContextMenuOpenedHandler
            );
        };
    }, [customContextMenuOpenedHandler]);

    useEffect(() => {
        if (isVisible) {
            document.dispatchEvent(
                new CustomEvent<string>('contextMenuOpened', {
                    detail: id,
                })
            );
        }
    }, [isVisible, id]);

    useEffect(() => {
        window.addEventListener('keydown', keyDownHandler);

        return () => {
            window.removeEventListener('keydown', keyDownHandler);
        };
    }, [keyDownHandler]);

    useEffect(() => {
        window.addEventListener('click', clickHandler);

        return () => {
            window.removeEventListener('click', clickHandler);
        };
    }, [clickHandler]);

    return (
        <>
            <div onContextMenu={contextMenuHandler}>{children}</div>
            {isVisible && (
                <ul
                    ref={ref}
                    style={{ left: position.x, top: position.y }}
                    className={styles.contextMenu}
                >
                    {items.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => {
                                setIsVisible(false);
                                onItemClicked(item);
                            }}
                        >
                            {item.caption}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};

export default ContextMenu;
