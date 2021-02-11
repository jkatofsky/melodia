from .app import socketio
from .models import Room, room_state_dict

from flask_socketio import join_room, leave_room, emit
from mongoengine.queryset.visitor import Q
from flask import request


@socketio.on('join')
def on_join(room_id):
    room: Room = Room.objects.get_or_404(pk=room_id)

    if not room.source_of_truth_sid:
        room.source_of_truth_sid = request.sid
        emit('notify-as-source-of-truth', room=request.sid)
        emit('get-room-state', room_state_dict(room), room=request.sid)
    else:
        room.other_participant_sids.append(request.sid)
        emit('playback-state-request', request.sid, room=room.source_of_truth_sid)

    # TODO: remove when done testing
    print('joined sid', request.sid)
    print('joined sot', room.source_of_truth_sid)
    print('joined others', room.other_participant_sids)

    join_room(room_id)
    room.save()

def on_leave_or_disconnect(room_id, sid):
    room: Room = Room.objects.get_or_404(pk=room_id)

    if sid == room.source_of_truth_sid:
        if len(room.other_participant_sids) == 0:
            room.source_of_truth_sid = None
            room.is_playing = False
        else:
            room.source_of_truth_sid = room.other_participant_sids.pop(0)
            socketio.emit('notify-as-source-of-truth', room=room.source_of_truth_sid)
    else:
        room.other_participant_sids.remove(sid)

    # TODO: remove when done testing
    print('leave sid', request.sid)
    print('leave sot', room.source_of_truth_sid)
    print('leave others', room.other_participant_sids)

    room.save()


@socketio.on('leave')
def on_leave(room_id):
    on_leave_or_disconnect(room_id, request.sid)
    leave_room(room_id)


@socketio.on('disconnect')
def on_disconnect():
    room_id = Room.objects.get(Q(source_of_truth_sid=request.sid)|Q(other_participant_sids=request.sid)).id
    on_leave_or_disconnect(room_id, request.sid)


@socketio.on('playback-state-response')
def on_playback_state_response(room_id, for_sid, is_playing, playback_time):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.is_playing = is_playing
    room.last_seeked_time = playback_time
    room.save()
    
    emit('get-room-state', room_state_dict(room), room=for_sid, include_self=True)
