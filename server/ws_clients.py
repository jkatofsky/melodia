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
        emit('notify-as-source-of-truth', to=request.sid)
        emit('get-room-state', room_state_dict(room), to=request.sid)
    else:
        room.other_client_sids.append(request.sid)
        emit('playback-state-request', request.sid, to=room.source_of_truth_sid)

    join_room(room_id)
    room.save()


def on_leave_or_disconnect(room_id, sid):
    room: Room = Room.objects.get_or_404(pk=room_id)

    if sid == room.source_of_truth_sid:
        if len(room.other_client_sids) == 0:
            room.source_of_truth_sid = None
            room.is_playing = False
        else:
            room.source_of_truth_sid = room.other_client_sids.pop(0)
            socketio.emit('notify-as-source-of-truth', to=room.source_of_truth_sid)
    else:
        room.other_client_sids.remove(sid)

    room.save()


@socketio.on('leave')
def on_leave(room_id):
    on_leave_or_disconnect(room_id, request.sid)
    leave_room(room_id)


@socketio.on('disconnect')
def on_disconnect():
    room_id = Room.objects.get(Q(source_of_truth_sid=request.sid)|Q(other_client_sids=request.sid)).id
    on_leave_or_disconnect(room_id, request.sid)


@socketio.on('playback-state-response')
def on_playback_state_response(room_id, sid_awaiting_state, is_playing, playback_time):
    room: Room = Room.objects.get_or_404(pk=room_id)

    room.is_playing = is_playing
    room.last_synced_playback_time = playback_time
    room.save()
    
    emit('get-room-state', room_state_dict(room), to=sid_awaiting_state)
