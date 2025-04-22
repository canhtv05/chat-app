function ChatListSkeleton() {
    return (
        <div className="shadow rounded-md p-6 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-base-300 h-[50px] w-[50px]"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="space-y-3 mt-1">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-3 bg-base-300 rounded col-span-2"></div>
                            <div className="h-3 bg-base-300 rounded col-span-1"></div>
                        </div>
                        <div className="h-3 bg-base-300 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatListSkeleton;
