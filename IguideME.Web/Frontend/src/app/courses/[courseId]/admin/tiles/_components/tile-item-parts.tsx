'use client';

import { type FC, memo, type ReactElement, useCallback, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Bell, BellOff, EyeIcon, EyeOffIcon, MessageCircle, NotebookPen, Trash2, Trophy } from 'lucide-react';

import { deleteTile } from '@/api/tiles';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useActionStatus } from '@/hooks/use-action-status';
import { type GradingType, printGradingType, type Tile, TileType } from '@/types/tile';

const TileActionButtons: FC<{ tile: Tile }> = memo(({ tile }): ReactElement => {
  const { mutate, isPending, status } = useMutation({ mutationFn: deleteTile });

  const description = useMemo(
    () => ({
      error: `Tile '${tile.title}' could not be deleted.`,
      success: `Tile '${tile.title}' has been successfully deleted.`,
    }),
    [tile.title],
  );

  useActionStatus({
    description,
    status,
  });

  return (
    <div className='flex items-center justify-center'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='grid h-10 w-10 cursor-help place-content-center'>
              {tile.visible ?
                <EyeIcon className='stroke-success' />
              : <EyeOffIcon className='stroke-destructive' />}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tile.visible ? 'This tile is visible to students.' : 'This tile is hidden from students.'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className='grid h-10 w-10 cursor-help place-content-center'>
              {tile.notifications ?
                <Bell className='stroke-success' />
              : <BellOff className='stroke-destructive' />}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              Notifications are toggled <b>{tile.notifications ? 'on' : 'off'}</b>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button
        onClick={(event) => {
          event.stopPropagation();
          mutate(tile.id);
        }}
        disabled={isPending}
        size='icon'
        variant='ghost'
      >
        <Trash2 className='stroke-destructive' />
      </Button>
    </div>
  );
});
TileActionButtons.displayName = 'TileActionButtons';

const TileTypeBadge: FC<{ type: TileType }> = memo(({ type }): ReactElement => {
  const getTooltipText = useCallback((): ReactElement => {
    const tooltipTexts = {
      [TileType.Assignments]: (
        <span>
          Assignment tiles group together assignments and quizzes completed by the students. These can be obtained from
          an LMS or uploaded manually.
        </span>
      ),
      [TileType.Discussions]: (
        <span>
          Discussion tiles give an overview of the messages the students have posted as well as the number of messages.
        </span>
      ),
      [TileType.LearningOutcomes]: (
        <span>
          Learning Goal tiles keep track of requirements or goals the students should complete during the course. Some
          examples of these are: the average of the partial exams must exceed X, students need to submit 10 discussions
          for participation, passing an extra assignments for honours, etc.
        </span>
      ),
    };

    return tooltipTexts[type];
  }, [type]);

  const getIconAndDescription = useCallback((): ReactElement => {
    const iconDescriptions = {
      [TileType.Assignments]: (
        <>
          <NotebookPen className='size-4' />
          <span>Assignments</span>
        </>
      ),
      [TileType.Discussions]: (
        <>
          <MessageCircle className='size-4' />
          <span>Discussions</span>
        </>
      ),
      [TileType.LearningOutcomes]: (
        <>
          <Trophy className='size-4' />
          <span>Learning Outcomes</span>
        </>
      ),
    };

    return iconDescriptions[type];
  }, [type]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className='flex cursor-help gap-1 text-sm'>{getIconAndDescription()}</TooltipTrigger>
        <TooltipContent className='max-w-[200px] md:max-w-xs'>{getTooltipText()}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
TileTypeBadge.displayName = 'TileTypeBadge';

interface TileGradingProps {
  gradingType: GradingType;
  tileType: TileType;
  weight: number;
}

const TileGrading: FC<TileGradingProps> = memo(({ gradingType, tileType, weight }): ReactElement => {
  return (
    <div className='flex h-full w-full justify-between'>
      {tileType === TileType.Assignments && (
        <p className='text-xs'>
          Grading:
          <br />
          {printGradingType(gradingType)}
        </p>
      )}
      {weight > 0 && (
        <p className='text-xs'>
          Weight:
          <br />
          {weight * 100}%
        </p>
      )}
    </div>
  );
});
TileGrading.displayName = 'TileGrading';

export { TileActionButtons, TileGrading, TileTypeBadge };
